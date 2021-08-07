import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {

  nextHeroes,
  lastHeroes,
  fetchHeroesFailure,
  fetchHeroesSuccess,
} from '../actions/index';
import baseUrl from '../helpers/base-url';
import HeroCard from '../components/HeroCard';
import Spinner from '../components/Spinner';
import MenuSelect from '../components/MenuSelect';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import './HeroesCatalogue.css';

function HeroesCatalogue({
  fetchHeroesFailure, heroes, filte, fetchHeroesSuccess,
}) {
  const cardsNumber = 5;
  const [heroess, setHeroes] = useState([]);
  const [heroesC, setHeroesC] = useState([]);
  const [start, setStart] = useState(0);
  const [dealCards, setDealCards] = useState('dealCards');
  const [indexMobile, setIndexMobile] = useState(0);

  useEffect(() => {
    fetch(`${baseUrl}`, { mode: 'cors' })
      .then((res) => {
        if (res.ok) {
          res.json().then((jsonRes) => {
            setHeroes(jsonRes);
            fetchHeroesSuccess(jsonRes);
            setHeroesC(jsonRes);
          });
        } else {
          fetchHeroesFailure('and error while fetch favourites');
        }
      }).catch((error) => {
        fetchHeroesFailure(error);
      });
  }, []);

  function firstFive(array) {
    let arr;
    let delimiter = 0;
    let anex;
    if (array.length < cardsNumber) arr = array.slice(start, array.length);
    else if (!array[start + cardsNumber]) {
      delimiter = start + cardsNumber - array.length;
      arr = array.slice(start, array.length);
      anex = array.slice(0, delimiter);
      arr = arr.concat(anex);
    } else if (start < 0) {
      delimiter = start + cardsNumber;
      arr = array.slice(start, array.length).concat(array.slice(0, delimiter));
    } else {
      arr = array.slice(start, start + cardsNumber);
    }
    return arr;
  }

  function oneByOne(array){
    const cardOne=array[indexMobile]
    return(
      <HeroCard 
      id={cardOne.id}
      image={cardOne.images.sm}
      name={cardOne.name}
      category={filte}
      />
    )
  }


  function handleIncrease(e) {
    e.preventDefault();
    
    setDealCards('takeCards')
    setTimeout(() => {
   
      if (start + cardsNumber > heroesC.length - 1) {
          setStart(0);
      } else {
          setStart(start + cardsNumber);
      }
    
    },1000)
    
    setTimeout(() => {
      setDealCards('dealCards')
      
    }, 1500);

    nextHeroes(cardsNumber);
  }

  function handleDecrese(e) {
    e.preventDefault();
    setDealCards('takeCards')
    setTimeout(() => {
      if (start < 0) {
        setStart(heroesC.length - 5);
      } else {
        setStart(start - cardsNumber);
      }
    },1000)
    setTimeout(() => {
      setDealCards('dealCards')
    }, 1500);
  }

  function handleOneDecrese(e) {
    e.preventDefault();

    if (start < -cardsNumber + 1) {
      setStart(heroesC.length - cardsNumber + 1);
    } else {
      setStart(start - 1);
    }
  }

  function handleOneIncrese(e) {
    e.preventDefault();

    if (start + 5 > heroesC.length + 3) {
      setStart(0);
    } else {
      setStart(start + 1);
    }
  }

  const searchHeroes = (filte) => {
    const cloneHeroes = heroess;
    let her;
    if (filte === 'All') {
      her = heroess;
    } else {
      her = cloneHeroes.filter((hero) => hero.appearance.race === filte);
    }
    setHeroesC(her);
    fetchHeroesSuccess(her);
    setStart(0);
  };

  let transition = 0;

  const searchByText = (text) => {
    const regex = new RegExp(text, 'gi');
    const cloneH = heroess;
    const filterBy = cloneH.filter((hero) => hero.name.match(regex));
    setHeroesC(filterBy);
  };
  

  let comp;
  if (heroes.loading) {
    comp = setInterval(() => { <Spinner />; }, 1000);
  } else if (heroes.error) {
    comp = <h2 className="error">{heroes.error}</h2>;
  } else {
    comp = (
      <>
        <SearchBar onChange={searchByText} />
        <CategoryFilter onChange={searchHeroes} />
        <div className="mobileCont">
          {
            oneByOne(heroesC)
          }
        </div>
        <div className="header-container mobiledisplay">
          {
            firstFive(heroesC).map((hero) => {
              transition += 1;
              return (
                <div key={hero.id} className={`${dealCards} deal card${transition}`}>
                  <HeroCard
                    id={hero.id}
                    image={hero.images.sm}
                    name={hero.name}
                    category={filte}
                  />
                </div>
              );
            })
          }

        </div>
        <div className="mobiledisplay">
          {
          heroesC.length > 5
            ? (
              <MenuSelect
                handleNext={handleIncrease}
                handleLast={handleDecrese}
                handleOneLast={handleOneDecrese}
                handleOneNext={handleOneIncrese}
              />
            ) : (
              null
            )
          }
        </div>
      </>
    );
  }

  return comp;
}

HeroesCatalogue.propTypes = {
  heroes: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    heroes: PropTypes.arrayOf(PropTypes.object),
    sHeroes: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.string.isRequired,

    text: PropTypes.string.isRequired,
  }),

  nextHeroes: PropTypes.func.isRequired,
  lastHeroes: PropTypes.func.isRequired,
};

HeroesCatalogue.defaultProps = {
  heroes: {},
};
const mapDispatchToProps = (dispatch) => ({
  fetchHeroesFailure: () => dispatch(fetchHeroesFailure()),
  nextHeroes: () => dispatch(nextHeroes()),
  lastHeroes: () => dispatch(lastHeroes()),
  fetchHeroesSuccess: (heroes) => dispatch(fetchHeroesSuccess(heroes)),
});

const mapStateToProps = (state) => ({
  filte: state.heroes.filter,
  heroes: state.heroes,
});

export default connect(mapStateToProps, mapDispatchToProps)(HeroesCatalogue);
