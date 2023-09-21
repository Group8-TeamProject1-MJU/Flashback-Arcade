import PacmanLoader from "react-spinners/PacmanLoader";

export default function CustomPacmanLoader({ 
    color = "#3e5845",
    loading = true,
    children 
}) {
    return (
        <PacmanLoader
            color={color}
            size={45}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="loader"
            loading={loading}
        />
    );
}
