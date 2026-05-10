import React, { useEffect, useState } from "react";
import BookService from "../services/BookService";

function BookList() {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        BookService.getAllBooks()
            .then((response) => {
                setBooks(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="container mt-5">

            <h2 className="text-center mb-4">
                Book List
            </h2>

            <table className="table table-bordered table-striped">

                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Price</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        books.map(
                            (book) =>
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.price}</td>
                                </tr>
                        )
                    }
                </tbody>

            </table>

        </div>
    );
}

export default BookList;