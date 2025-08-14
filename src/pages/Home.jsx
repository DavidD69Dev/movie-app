import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import { useSearchParams } from "react-router"; 
import "../css/Home.css";

function Home () {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams(); // ← Ajout

    // Charger les films au démarrage ou quand la query change
    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                const query = searchParams.get("query");
                if (query) {
                    const searchResults = await searchMovies(query);
                    setMovies(searchResults);
                } else {
                    const popularMovies = await getPopularMovies();
                    setMovies(popularMovies);
                }
                setError(null);
            } catch(err) {
                setError("Failed to load movies...");
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchParams({}); // Pas de `/?`
            return;
        }
        setSearchParams({ query: searchQuery }); // Met la recherche dans l'URL
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchParams({}); // Retour aux films populaires
    };

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search for movies..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
                {searchParams.get("query") && (
                    <button 
                        type="button" 
                        className="clear-button"
                        onClick={handleClearSearch}
                    >
                        ⬅ Retour
                    </button>
                )}
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
