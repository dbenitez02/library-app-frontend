import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";


export const AdminMessages = () => {
    
    const { authState } = useOktaAuth();

    // Normal loading states
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(false);


    //Messages endpoint staet
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5)
    
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {

            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const messagesResponse = await fetch(url, requestOptions);

                if(!messagesResponse.json) {
                    throw new Error("Something went wrong!");
                }

                const messagesResponseJson = await messagesResponse.json();
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
            
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);

    }, [authState, currentPage]);

    if (isLoadingMessages) {
        <SpinnerLoading />
    }

    if (httpError) {
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return(
        <div className="mt-3">
            {messages.length > 0 ?
            <>
                <h5>Pending Q/A:</h5>
                {messages.map(message => {
                    <p>Questions that need a response</p>
                })}
            </>
            :
            <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}