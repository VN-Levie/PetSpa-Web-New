// export const API_ENDPOINT = 'https://petspa-api.haitac.vip';
// export const API_ENDPOINT = 'https://petspa-api-lap.haitac.vip';
export const API_ENDPOINT = 'http://localhost:8090';

export const imgUrl = (imageUrl) => {


    let formattedUrl = imageUrl;

    // Xử lý URL
    if (!formattedUrl.startsWith('http')) {
        // Nếu URL không bắt đầu bằng "http", ghép nối với API_ENDPOINT
        formattedUrl = `${API_ENDPOINT}${formattedUrl}`;
    } else if (formattedUrl.startsWith('http://localhost:')) {
        // Nếu URL là localhost, thay thế bằng API_ENDPOINT
        formattedUrl = formattedUrl.replace(/^http:\/\/localhost:\d+/, API_ENDPOINT);
    }

    return formattedUrl;
};
