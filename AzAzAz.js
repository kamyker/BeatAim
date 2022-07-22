function GetCdnLinkCached(path)
{
    return `https://beataim.b-cdn.net/${path}`;
}

function GetCdnLinkCacheBusted(path)
{
    return `https://beataim.b-cdn.net/${path}?z=${new Date().getTime()}`;
}

function GetCdnLinkCacheBustedToOneMinute(path)
{
    return `https://beataim.b-cdn.net/${path}?z=${getTotalMinutesUTC()}`;
}

function convertDateToUTC(date)
{
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(),
        date.getUTCSeconds());
}

function getTotalMinutesUTC()
{
    return Math.round(convertDateToUTC(new Date()) / 1000 / 60 + 62135596800000 / 1000 / 60); //in C# version
}