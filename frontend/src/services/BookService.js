import axios from "axios";

const API_URL = "http://localhost:8081/books";

class BookService {

    getAllBooks() {
        return axios.get(API_URL);
    }

}

export default new BookService();