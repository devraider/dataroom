import datetime as dt


def utc_now() -> dt.datetime:
    """Get the current UTC datetime"""
    return dt.datetime.now(dt.UTC)
