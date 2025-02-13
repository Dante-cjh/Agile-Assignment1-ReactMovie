import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from '../components/spinner'
import RemoveFromFavorites from "../components/cardIconAndAvatar/icons/removeFromFavorites";
import WriteReview from "../components/cardIconAndAvatar/icons/writeReview";

const FavoriteMoviesPage = () => {
    const {favorites: movieIds } = useContext(MoviesContext);

    // Create an array of queries and run in parallel.
    const favoriteMovieQueries = useQueries(
        movieIds.map((movieId) => {
            return {
                queryKey: ["movie", { id: movieId }],
                queryFn: getMovie,
            };
        })
    );
    // Check if any of the parallel queries is still loading.
    const isLoading = favoriteMovieQueries.find((m) => m.isLoading === true);

    if (isLoading) {
        return <Spinner />;
    }
    //提取了流派ID为Movie一个单独的数组属性
    const movies = favoriteMovieQueries.map((q) => {
        q.data.genre_ids = q.data.genres.map(g => g.id)
        return q.data
    });

    return (
        <PageTemplate
            title="Favorite Movies"
            movies={movies}
            action={(movie) => {
                return (
                    <>
                        <RemoveFromFavorites movie={movie} />
                        <WriteReview movie={movie} />
                    </>
                );
            }}
            avatarCheck={() => {}} //no avatar for favorite movies
        />
    );
};

export default FavoriteMoviesPage;