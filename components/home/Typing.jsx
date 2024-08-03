"use client"
import React from "react";
import Typed from 'typed.js'

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
        this.typed = new Typed(this.el, options);
    }
    componentWillUnmount() {
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