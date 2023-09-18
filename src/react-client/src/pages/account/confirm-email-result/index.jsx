import { useParams } from "react-router-dom";

export default function ConfirmEmailResult() {
    const { msg } = useParams();

    return (
        <>
            {msg}
        </>
    )
}
