import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [bookDelete, setBookDelete] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${booksPerPage}`;


            const response = await fetch(baseUrl);

            // Guard clause, making sure we got the data we are looking for.
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            // If we got the data, we move on! and turn the response into a .json
            const responseJson = await response.json();

            // Grabbing all the books.
            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadingBooks: BookModel[] = [];

            // Pushing all data into the loadingBooks[]
            for (const key in responseData) {
                loadingBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img

                });

            }

            // Once all data is loaded
            setBooks(loadingBooks);
            setIsLoading(false);

        };

        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [booksPerPage, currentPage, bookDelete]);

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;

    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks
        ? booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteBook = () => setBookDelete(!bookDelete);

    if (isLoading) {
        <SpinnerLoading />
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return(
        <div className="container mt-5">
            {totalAmountOfBooks > 0 ?
            <>
                <div className="mt-3">
                    <h3>Number of results: {totalAmountOfBooks}</h3>
                </div>
                <p>
                    {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                </p>
                {books.map(book => (
                    <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}/>
                ))}
            </>    
            :
            <h5>Add a book before changing quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}

        </div>
    );
}