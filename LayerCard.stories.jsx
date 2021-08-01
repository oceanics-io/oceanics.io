/**
 * React and friends
 */
import React from 'react';

/**
 * Base component
 */
import LayerCard from './LayerCard';

import "./src/styles/global.css";
import "./src/styles/theme.css";

/**
 * Storybook Interface
 */
export default {
    component: LayerCard,
    title: 'MapBox/LayerCard',
}

/**
 * Base case
 * 
 * @param {*} args 
 * @returns 
 */
const Template = (args) => <LayerCard {...args} />;

/**
 * Default test case
 */
export const Default = Template.bind({});
Default.args = {
    id: "a-layer",
    url: "example.com",
    type: "point",
    component: "a component",
    maxzoom: 20,
    minzoom: 1,
    zoomLevel: 10,
    attribution: "Oceanics.io",
    info: null,
    onClick: null
};