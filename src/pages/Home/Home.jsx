import React from 'react';
import BannerSlider from './BannerSlider/BannerSlider';
import Categories from '../Categories/Categories';
import DiscountProducts from './DiscountProducts/DiscountProducts';

const Home = () => {
    return (
        <div>
            <BannerSlider></BannerSlider>
            <Categories></Categories>
            <DiscountProducts></DiscountProducts>
        </div>
    );
};

export default Home;