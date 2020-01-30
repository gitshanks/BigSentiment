
import styled from 'styled-components';
const Card = styled.div`
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5);
    transition: 0.5s;
    margin-left: 1em;
    margin-right: 1em;
    &:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.9);
    }
`;

export default Card;
