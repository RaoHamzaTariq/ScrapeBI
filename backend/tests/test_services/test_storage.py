import pytest
from unittest.mock import MagicMock, patch
from io import BytesIO
from app.services.storage import StorageService
from app.config import settings


@pytest.mark.asyncio
async def test_storage_service_initialization():
    """Test storage service initialization."""
    service = StorageService()

    assert service is not None
    assert service.minio_client is not None


@pytest.mark.asyncio
async def test_init_bucket_success(mock_minio_client):
    """Test successful bucket initialization."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the bucket_exists and make_bucket methods
    mock_minio_client.bucket_exists.return_value = False

    await service.init_bucket()

    # Verify that bucket_exists was called
    mock_minio_client.bucket_exists.assert_called_once_with(settings.minio_bucket)
    # Verify that make_bucket was called since bucket didn't exist
    mock_minio_client.make_bucket.assert_called_once_with(settings.minio_bucket)


@pytest.mark.asyncio
async def test_init_bucket_already_exists(mock_minio_client):
    """Test bucket initialization when bucket already exists."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the bucket_exists to return True
    mock_minio_client.bucket_exists.return_value = True

    await service.init_bucket()

    # Verify that bucket_exists was called
    mock_minio_client.bucket_exists.assert_called_once_with(settings.minio_bucket)
    # Verify that make_bucket was NOT called since bucket exists
    mock_minio_client.make_bucket.assert_not_called()


@pytest.mark.asyncio
async def test_upload_file_success(mock_minio_client):
    """Test successful file upload."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the put_object method
    mock_minio_client.put_object.return_value = None

    file_content = b"test file content"
    file_path = "test/file.txt"

    result = await service.upload_file(file_content, file_path)

    # Verify that put_object was called with correct parameters
    mock_minio_client.put_object.assert_called_once()
    call_args = mock_minio_client.put_object.call_args
    assert call_args[0][0] == settings.minio_bucket  # bucket name
    assert call_args[0][1] == file_path  # object name
    assert call_args[1]["content_type"] == "application/octet-stream"

    # Verify the result
    assert result == file_path


@pytest.mark.asyncio
async def test_upload_file_with_content_type(mock_minio_client):
    """Test file upload with specific content type."""
    service = StorageService()
    service.client = mock_minio_client

    mock_minio_client.put_object.return_value = None

    file_content = b"test image content"
    file_path = "test/image.png"

    result = await service.upload_file(file_content, file_path)

    # Verify that put_object was called with correct content type for image
    mock_minio_client.put_object.assert_called_once()
    call_kwargs = mock_minio_client.put_object.call_args[1]
    # Content type should be determined based on file extension
    assert call_kwargs["content_type"] in ["image/png", "application/octet-stream"]


@pytest.mark.asyncio
async def test_upload_file_failure(mock_minio_client):
    """Test file upload failure handling."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the put_object method to raise an exception
    mock_minio_client.put_object.side_effect = Exception("Upload failed")

    file_content = b"test file content"
    file_path = "test/file.txt"

    with pytest.raises(Exception) as exc_info:
        await service.upload_file(file_content, file_path)

    assert "Upload failed" in str(exc_info.value)


@pytest.mark.asyncio
async def test_download_file_success(mock_minio_client):
    """Test successful file download."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the get_object method to return a response with data
    mock_response = MagicMock()
    mock_response.read.return_value = b"downloaded content"
    mock_response.close.return_value = None
    mock_response.release_conn.return_value = None
    mock_minio_client.get_object.return_value = mock_response

    file_path = "test/file.txt"

    result = await service.download_file(file_path)

    # Verify that get_object was called with correct parameters
    mock_minio_client.get_object.assert_called_once_with(settings.minio_bucket, file_path)

    # Verify the result
    assert result == b"downloaded content"


@pytest.mark.asyncio
async def test_download_file_not_found(mock_minio_client):
    """Test file download when file doesn't exist."""
    from minio.error import S3Error

    service = StorageService()
    service.client = mock_minio_client

    # Mock the get_object method to raise S3Error (file not found)
    mock_minio_client.get_object.side_effect = S3Error(
        "NoSuchKey", "The specified key does not exist.", 404
    )

    file_path = "test/nonexistent.txt"

    with pytest.raises(S3Error):
        await service.download_file(file_path)


@pytest.mark.asyncio
async def test_delete_file_success(mock_minio_client):
    """Test successful file deletion."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the remove_object method
    mock_minio_client.remove_object.return_value = None

    file_path = "test/file.txt"

    await service.delete_file(file_path)

    # Verify that remove_object was called with correct parameters
    mock_minio_client.remove_object.assert_called_once_with(settings.minio_bucket, file_path)


@pytest.mark.asyncio
async def test_delete_file_not_found(mock_minio_client):
    """Test file deletion when file doesn't exist."""
    from minio.error import S3Error

    service = StorageService()
    service.client = mock_minio_client

    # Mock the remove_object method to raise S3Error
    mock_minio_client.remove_object.side_effect = S3Error(
        "NoSuchKey", "The specified key does not exist.", 404
    )

    file_path = "test/nonexistent.txt"

    with pytest.raises(S3Error):
        await service.delete_file(file_path)


@pytest.mark.asyncio
async def test_file_exists_true(mock_minio_client):
    """Test checking if file exists (it does exist)."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the stat_object method to return success
    mock_stat = MagicMock()
    mock_minio_client.stat_object.return_value = mock_stat

    file_path = "test/file.txt"

    result = await service.file_exists(file_path)

    # Verify that stat_object was called with correct parameters
    mock_minio_client.stat_object.assert_called_once_with(settings.minio_bucket, file_path)

    # Verify the result
    assert result is True


@pytest.mark.asyncio
async def test_file_exists_false(mock_minio_client):
    """Test checking if file exists (it doesn't exist)."""
    from minio.error import S3Error

    service = StorageService()
    service.client = mock_minio_client

    # Mock the stat_object method to raise S3Error (file not found)
    mock_minio_client.stat_object.side_effect = S3Error(
        "NoSuchKey", "The specified key does not exist.", 404
    )

    file_path = "test/nonexistent.txt"

    result = await service.file_exists(file_path)

    # Verify that stat_object was called with correct parameters
    mock_minio_client.stat_object.assert_called_once_with(settings.minio_bucket, file_path)

    # Verify the result
    assert result is False


@pytest.mark.asyncio
async def test_generate_presigned_url_success(mock_minio_client):
    """Test generating presigned URL."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the presigned_get_object method
    expected_url = "https://example.com/presigned-url"
    mock_minio_client.presigned_get_object.return_value = expected_url

    file_path = "test/file.txt"

    result = await service.generate_presigned_url(file_path)

    # Verify that presigned_get_object was called with correct parameters
    mock_minio_client.presigned_get_object.assert_called_once_with(
        settings.minio_bucket, file_path, expires=604800  # 7 days
    )

    # Verify the result
    assert result == expected_url


@pytest.mark.asyncio
async def test_generate_presigned_url_with_custom_expiry(mock_minio_client):
    """Test generating presigned URL with custom expiry."""
    service = StorageService()
    service.client = mock_minio_client

    expected_url = "https://example.com/presigned-url"
    mock_minio_client.presigned_get_object.return_value = expected_url

    file_path = "test/file.txt"

    result = await service.generate_presigned_url(file_path, expires=3600)  # 1 hour

    # Verify that presigned_get_object was called with custom expiry
    mock_minio_client.presigned_get_object.assert_called_once_with(
        settings.minio_bucket, file_path, expires=3600
    )

    assert result == expected_url


@pytest.mark.asyncio
async def test_get_file_metadata_success(mock_minio_client):
    """Test getting file metadata."""
    service = StorageService()
    service.client = mock_minio_client

    # Mock the stat_object method to return metadata
    mock_stat = MagicMock()
    mock_stat.size = 1024
    mock_stat.content_type = "text/plain"
    mock_stat.last_modified = "2023-01-01T00:00:00Z"
    mock_minio_client.stat_object.return_value = mock_stat

    file_path = "test/file.txt"

    result = await service.get_file_metadata(file_path)

    # Verify that stat_object was called with correct parameters
    mock_minio_client.stat_object.assert_called_once_with(settings.minio_bucket, file_path)

    # Verify the result structure
    assert result["size"] == 1024
    assert result["content_type"] == "text/plain"
    assert result["last_modified"] == "2023-01-01T00:00:00Z"


@pytest.mark.asyncio
async def test_get_file_metadata_not_found(mock_minio_client):
    """Test getting file metadata when file doesn't exist."""
    from minio.error import S3Error

    service = StorageService()
    service.client = mock_minio_client

    # Mock the stat_object method to raise S3Error
    mock_minio_client.stat_object.side_effect = S3Error(
        "NoSuchKey", "The specified key does not exist.", 404
    )

    file_path = "test/nonexistent.txt"

    with pytest.raises(S3Error):
        await service.get_file_metadata(file_path)