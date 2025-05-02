export async function searchFood(query) {
    const appId = process.env.REACT_APP_NUTRITIONIX_APP_ID;
    const apiKey = process.env.REACT_APP_NUTRITIONIX_API_KEY;
    // Debug biến môi trường
    console.log('App ID:', appId);
    console.log('App KEY:', apiKey);

    const res = await fetch(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': appId,
                'x-app-key': apiKey
            },
            body: JSON.stringify({ query })
        }
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API lỗi ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.foods;
}
