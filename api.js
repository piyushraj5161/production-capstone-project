const API_URL = "https://fakestoreapi.com/products";

export async function getProducts() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("API Error");
    }

    return await response.json();
}
