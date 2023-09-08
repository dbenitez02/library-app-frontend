import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { error } from "console";
import { LatestReveiws } from "./LatestReview";

export const BookCheckoutPage = () => {

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    /** Review State */
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);


    // localhost:3000/checkout/1 grabs the '1'
    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;


            const response = await fetch(baseUrl);

            // Guard clause, making sure we got the data we are looking for.
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            // If we got the data, we move on! and turn the response into a .json
            const responseJson = await response.json();

            // Grabbing the individual book.
            const loadingBooks: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img
            };

            // Once all data is loaded
            setBook(loadingBooks);
            setIsLoading(false);

        };

        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    /** Review UseEffect */
    useEffect(() => {
        const fetchBookReviews = async () => {

            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            
            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error("Something went wrong!");
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription
                });

                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if(loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);

        };

        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error);
        })
    }, []);


    /**
    * These conditions are checking if the page is loading or receives an http error
    */
    if (isLoading || isLoadingReview) {
        return (
            <SpinnerLoading />
        )
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {
                        book?.img 
                        ?
                        <img src={book?.img} width='226' height='349' alt="Book"/>
                        :  
                          <img src={require("./../../Images/BookImages/book-luv2code-1000.png")} 
                          width='229' height='349' alt="Book"/>
                        }
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr/>
                <LatestReveiws reviews={reviews} bookId={book?.id} mobile={false}/>
            </div>
            {/** Mobile layout */}
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                {
                        book?.img 
                        ?
                        <img src={book?.img} width='226' height='349' alt="Book"/>
                        :  
                          <img src={require("./../../Images/BookImages/book-luv2code-1000.png")} 
                          width='229' height='349' alt="Book"/>
                        }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                        <CheckoutAndReviewBox book={book} mobile={true} />
                    </div>
                </div>
                <hr/>
                <LatestReveiws reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    );
}