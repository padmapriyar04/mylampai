"use client"
import { color } from "framer-motion";
// filename: Typing.js
// React version: "^16.12.0"
import React from "react";
import Typed from 'typed.js'
// Import the desired words

const words = [
    "Explore",
    "Choose",
    "Achieve"
];

class Typing extends React.Component {
    componentDidMount() {
        const options = {
            strings: words,
            typeSpeed: 200,
            backSpeed: 100,
            loop: true,
            cursorChar: "|",
        };
        // this.el refers to the <span> in the render() method
        this.typed = new Typed(this.el, options);
    }
    componentWillUnmount() {
        // Please don't forget to cleanup animation layer
        this.typed.destroy();
    }

    render() {
        return (
            <>
                <span
                    style={{ whiteSpace: "pre" }}
                    ref={(el) => {
                        this.el = el;
                    }}
                    className='text-[#8C52FF]'
                />
            </>
        );
    }
}
export default Typing;