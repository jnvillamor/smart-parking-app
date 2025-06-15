import time
from datetime import datetime, timedelta, timezone

# Get your local timezone offset
def get_local_timezone():
    offset_sec = -time.timezone if time.localtime().tm_isdst == 0 else -time.altzone
    return timezone(timedelta(seconds=offset_sec))

# Convert a local datetime to UTC
def to_utc(dt: datetime) -> datetime:
    return dt.astimezone(timezone.utc)

# Get the current UTC time of the local timezone
def get_current_utc_time():
    local_tz = get_local_timezone()
    return datetime.now(local_tz).astimezone(timezone.utc)


# Get UTC date range for today based on local time
def get_today_utc_range():
    local_tz = get_local_timezone()
    today_local = datetime.now(local_tz).date()

    start_local = datetime.combine(today_local, datetime.min.time(), tzinfo=local_tz)
    end_local = datetime.combine(today_local, datetime.max.time(), tzinfo=local_tz)

    return to_utc(start_local), to_utc(end_local)

# Get UTC date range for current month based on local time
def get_month_utc_range():
    local_tz = get_local_timezone()
    now_local = datetime.now(local_tz)

    # Start of the month
    start_local = datetime(now_local.year, now_local.month, 1, tzinfo=local_tz)

    # Start of next month
    if now_local.month == 12:
        next_month = datetime(now_local.year + 1, 1, 1, tzinfo=local_tz)
    else:
        next_month = datetime(now_local.year, now_local.month + 1, 1, tzinfo=local_tz)

    end_local = next_month - timedelta(microseconds=1)

    return to_utc(start_local), to_utc(end_local)