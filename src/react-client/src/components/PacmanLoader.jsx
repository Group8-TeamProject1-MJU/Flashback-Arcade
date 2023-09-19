import PacmanLoader from "react-spinners/PacmanLoader";

export default function CustomPacmanLoader({ loading, children }) {
    return (
        <PacmanLoader
            color="#36d7b7"
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
        />

    );
}
