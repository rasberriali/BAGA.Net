import React from "react";
import styled from "styled-components";

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="container"></div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  height: 100vh; /* Ensures the wrapper fills the screen */
  width: 100vw;
  overflow: hidden; /* Prevents scrollbars if effects exceed boundaries */
  position: relative;

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    --c: #09f;
    background-color: #000;
    background-image: radial-gradient(4px 100px at 0px 235px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 235px, var(--c), #0000);
    background-size: 300px 300px;
    animation: hi 150s linear infinite;
  }

  .container::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image: radial-gradient(
      circle at 50% 50%,
      #0000 0,
      #0000 2px,
      hsl(0 0 4%) 2px
    );
    background-size: 8px 8px;
    backdrop-filter: blur(1em) brightness(6);
    animation: hii 10s linear infinite;
  }

  @keyframes hi {
    0% {
      background-position: 0px 0px;
    }
    to {
      background-position: 0px 8000px;
    }
  }

  @keyframes hii {
    0% {
      backdrop-filter: blur(1em) brightness(6) hue-rotate(0deg);
    }
    to {
      backdrop-filter: blur(1em) brightness(6) hue-rotate(360deg);
    }
  }
`;

export default Pattern;
