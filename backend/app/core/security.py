import asyncio
import ipaddress
import re
from urllib.parse import urlparse
from typing import List, Optional, Set
from .config import settings


def is_valid_url(url: str) -> bool:
    """
    Validate URL format and check against security restrictions.
    Blocks file://, localhost, internal IPs, and other potentially dangerous URLs.
    """
    try:
        parsed = urlparse(url)

        # Check if it's a valid URL with scheme
        if not parsed.scheme or parsed.scheme not in ['http', 'https']:
            return False

        # Block file:// URLs
        if parsed.scheme == 'file':
            return False

        # Block URLs with no netloc (like file paths)
        if not parsed.netloc:
            return False

        # Extract hostname
        hostname = parsed.hostname
        if not hostname:
            return False

        # Block localhost
        if hostname.lower() in ['localhost', '127.0.0.1', '[::1]']:
            return False

        # Check if it's an internal IP address
        try:
            ip_addr = ipaddress.ip_address(hostname)
            if ip_addr.is_private or ip_addr.is_loopback or ip_addr.is_link_local:
                return False
        except ValueError:
            # Not an IP address, continue with hostname checks
            pass

        # Block internal hostnames (like those ending in .internal, .local, etc.)
        if hostname.lower().endswith(('.internal', '.local', '.lan')):
            return False

        # If allowed_domains is set, only allow those domains
        if settings.allowed_domains:
            allowed_domains_list = [domain.strip() for domain in settings.allowed_domains.split(',')]
            if hostname.lower() not in [domain.lower() for domain in allowed_domains_list]:
                return False

        return True
    except Exception:
        return False


def is_blocked_ip(ip: str) -> bool:
    """
    Check if an IP address is in the blocked list.
    """
    try:
        if settings.blocked_ips:
            blocked_ips_list = [blocked_ip.strip() for blocked_ip in settings.blocked_ips.split(',')]
            if ip in blocked_ips_list:
                return True

        # Check if IP is private/internal
        ip_addr = ipaddress.ip_address(ip)
        return ip_addr.is_private or ip_addr.is_loopback or ip_addr.is_link_local
    except ValueError:
        # Invalid IP address format
        return True


async def check_rate_limit(identifier: str, limit: int = 10, window: int = 60) -> bool:
    """
    Check if the identifier has exceeded the rate limit.
    This is a placeholder implementation - in production you'd integrate with Redis for distributed rate limiting.
    """
    # In a real implementation, you'd use Redis to track requests
    # For now, this is a placeholder that always returns True (no rate limiting)
    return True


def sanitize_url(url: str) -> str:
    """
    Sanitize URL to prevent potential security issues.
    """
    # Remove potential dangerous fragments
    parsed = urlparse(url)
    # Remove fragment and potentially sensitive query parameters
    sanitized = parsed._replace(fragment='', query=parsed.query).geturl()
    return sanitized


def get_domain_from_url(url: str) -> Optional[str]:
    """
    Extract domain from URL.
    """
    try:
        parsed = urlparse(url)
        return parsed.hostname
    except Exception:
        return None