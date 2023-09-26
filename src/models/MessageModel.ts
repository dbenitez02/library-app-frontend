class MessageModel {
    title: string;
    message: string;
    id?: number;
    userEmail?: string;
    adminEmail?: string;
    resposne?: string;
    closed?: string;

    constructor(title: string, message: string) {
        this.title = title;
        this.message = message;
    }
}

export default MessageModel;