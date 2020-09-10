function GrtAzureAccessData(documentId, partitionKey)
{
    var readOnlyKey = '';
    var date = new Date().toUTCString()

    var collectionId = "main";
    var databaseId = "main";
    var verb = "GET";
    var resourceType = "docs";
    var resourceLink = `dbs/${databaseId}/colls/${collectionId}/docs/${documentId}`;

    var resourceId = resourceLink;

    var token = GenerateMasterKeyAuthorizationSignature(verb, resourceId, resourceType, readOnlyKey, "master", "1.0", date);

    return {
        Url: `https://badata.documents.azure.com/${resourceLink}`,
        Headers:
        {
            "Authorization": token,
            "x-ms-date": date,
            "x-ms-version": "2018-12-31",
            "x-ms-documentdb-partitionkey": `[\"${partitionKey}\"]`
        }
    };
}

function GenerateMasterKeyAuthorizationSignature(verb, resourceId, resourceType, key, keyType, tokenVersion, date)
{
    // date = "Tue, 24 Mar 2020 21:45:00 GMT";
    // var hash = CryptoJS.HmacSHA256("Message", "secret");
    // var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    // document.write(hashInBase64);
    var payLoad = `${verb.toLowerCase()}\n${resourceType.toLowerCase()}\n${resourceId}\n${date.toLowerCase()}\n${""}\n`;
    // var wordsKey = CryptoJS.enc.Hex.parse(key);
    // var hashPayLoad = CryptoJS.HmacSHA256(payLoad, wordsKey);
    var hash = CryptoJS.HmacSHA256(CryptoJS.enc.Utf8.parse(payLoad), CryptoJS.enc.Base64.parse(key));
    // string signature = Convert.ToBase64String(hashPayLoad);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    // console.log(hashInBase64);
    // console.log(hashInBase64.toString(CryptoJS.enc.Base64));

    return encodeURIComponent(`type=${keyType}&ver=${tokenVersion}&sig=${hashInBase64}`);
}

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