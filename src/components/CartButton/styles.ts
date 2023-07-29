import { styled } from "@stitches/react";

export const CartButtonContainer = styled('button', {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    borderRadius: 6,
    position: "relative",
    backgroundColor: '$gray800',
    color: '$gray500',
    width: '3rem',
    height: '3rem',

    '&:disablad': {
        opacity: 0.6,
        cursor: "not-allowed",
    },

    svg: {
        fontSize: 24,
    }
})