import PacmanLoader from "react-spinners/PacmanLoader";

export default function CustomPacmanLoader({ 
    color = "#f1e702",
    loading = true,
    className,
    children 
}) {
    className = (className === undefined) ? "loader" : "loader " + className;

    return (
        <PacmanLoader
            color={color}
            size={45}
            aria-label="Loading Spinner"
            data-testid="loader"
            className={className}
            loading={loading}
        />
    );
}
