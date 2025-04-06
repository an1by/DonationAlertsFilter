let filterNames = ["russian_ban_words", "english_bad_words", "symbols"]
let words = [];

for await (let filterName of filterNames) {
    const response = await fetch(
        `https://raw.githubusercontent.com/an1by/DonationAlertsFilter/refs/heads/master/filters/${filterName}.txt`
    );
    const responseWords = (await response.text()).replaceAll("\n", " ");
    words.push(...responseWords);
}

var encodedData = encodeURIComponent(`main_currency=RUB&timezone=Europe%2FMoscow&language=ru_RU&remove_links=1&black_list_words=${words}&words=&email_news=0`);
var body = `data=${encodedData}&form=settings_general`

fetch("https://www.donationalerts.com/savesettings/general", {
    "headers": {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        "Referer": "https://www.donationalerts.com/dashboard/donations-settings/blacklist",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "method": "POST",
    "credentials": "same-origin",
    "body": body
});