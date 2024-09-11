import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkeletonCard from '../components/SkeletonCard';
import { FaHeartbeat, FaBolt, FaShieldAlt } from 'react-icons/fa'; // Correct icons

// Number of Pokémon per page
const ITEMS_PER_PAGE = 15;

// Capitalize first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Shop = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${ITEMS_PER_PAGE}`);
        const pokemonsData = response.data.results;
        const detailedPokemons = await Promise.all(
          pokemonsData.map(async (pokemon) => {
            const { data } = await axios.get(pokemon.url);
            return {
              name: capitalizeFirstLetter(data.name),
              image: data.sprites.other['official-artwork'].front_default,
              types: data.types.map(typeInfo => capitalizeFirstLetter(typeInfo.type.name)).join(', '),
              hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
              attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
              defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
            };
          })
        );
        setPokemons(detailedPokemons);
        setTotalPages(Math.ceil(response.data.count / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [page]);

  const skeletonCards = Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
    <SkeletonCard key={index} />
  ));

  return (
    <div className="bg-neutral-900 min-h-screen p-4 flex flex-col items-center">
      {loading ? (
        <div className="grid grid-cols-5 gap-4 mb-6 w-full max-w-screen-lg">
          {skeletonCards}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4 mb-6 w-full max-w-screen-lg">
            {pokemons.map((pokemon) => (
              <div key={pokemon.name} className="bg-neutral-800 text-neutral-100 rounded-md shadow-md p-4 flex flex-col items-center">
                <img src={pokemon.image} alt={pokemon.name} className="w-24 h-24 mb-2" />
                <h2 className="text-md font-semibold mb-1">{pokemon.name}</h2>
                <p className="text-sm text-neutral-300">{pokemon.types}</p>
                <div className="flex gap-2 mt-2">
                  <div className="flex items-center gap-1 text-sm text-neutral-300">
                    <FaHeartbeat className="text-red-500" /> {pokemon.hp}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-neutral-300">
                    <FaBolt className="text-yellow-500" /> {pokemon.attack}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-neutral-300">
                    <FaShieldAlt className="text-blue-500" /> {pokemon.defense}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-neutral-700 text-neutral-100 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-neutral-100">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="bg-neutral-700 text-neutral-100 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;
