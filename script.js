async function getAlreadyBlacklistedWords() {
    const tokenResponse = await fetch("https://www.donationalerts.com/api/v1/session/token?spa_page=dashboard", {
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.donationalerts.com/dashboard/donations-settings/blacklist",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "GET",
        credentials: "same-origin"
    });
    const apiToken = (await tokenResponse.json()).data.api_token
    
    const userResponse = await fetch("https://www.donationalerts.com/api/v1/user", {
        headers: {
            "Authorization": `Bearer ${apiToken}`,
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.donationalerts.com/dashboard/donations-settings/blacklist",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "GET",
        credentials: "same-origin"
    });
    return (await userResponse.json()).data.black_list_words;
}

async function getFilterWords() {
    const filterNames = ["russian_ban_words", "english_bad_words", "symbols"]
    const words = [];

    for await (const filterName of filterNames) {
        const response = await fetch(
            `https://raw.githubusercontent.com/an1by/DonationAlertsFilter/refs/heads/master/filters/${filterName}.txt`
        );
        const responseWords = (await response.text()).replaceAll("\n", " ");
        words.push(responseWords);
    }

    return words;
}

async function setBlacklistedWords(words) {
    const encodedData = encodeURIComponent(`main_currency=RUB&timezone=Europe%2FMoscow&language=ru_RU&remove_links=1&black_list_words=${words.join(" ")}&words=&email_news=0`);
    const body = `data=${encodedData}&form=settings_general`

    await fetch("https://www.donationalerts.com/savesettings/general", {
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://www.donationalerts.com/dashboard/donations-settings/blacklist",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "POST",
        credentials: "same-origin",
        body: body
    });

    return "Все готово!";
}

const existWords = await getAlreadyBlacklistedWords();
const filterWords = await getFilterWords();
const words = [...new Set([...existWords, ...filterWords])];

await setBlacklistedWords(words);