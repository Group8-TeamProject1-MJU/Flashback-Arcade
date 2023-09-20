import PacmanLoader from "react-spinners/PacmanLoader";

export default function CustomPacmanLoader({ loading, children }) {
    return (
        <PacmanLoader
            color={"#f1e702"}
            size={45}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="loader"
        />
    );
}
