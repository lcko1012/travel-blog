import React from 'react'
import PropTypes from 'prop-types'
import useWindowDimensions from './useWindowDimensions'

function GridCustom({children, ...props}, ) {
    const {height, width} = useWindowDimensions()
    const gridStyleCustom = () => {
        return {
            // '--md-grid-template-rows': props.mdGridTemplateRows,
            // '--md-grid-template-columns' : props.mdGridTemplateColumns,
            // '--md-grid-row-gap': props.mdGridRowGap,
            // '--md-grid-column-gap': props.mdGridColumnGap,
            // '--sm-grid-template-rows': props.smGridTemplateRows,
            // '--sm-grid-template-columns' : props.smGridTemplateColumns,
            // '--sm-grid-row-gap': props.smGridRowGap,
            // '--sm-grid-column-gap': props.smGridColumnGap,
            gridTemplateRows: props.mdGridTemplateRows,
            gridTemplateColumns: props.mdGridTemplateColumns,
            gridRowGap: props.mdGridRowGap,
            gridColumnGap: props.mdGridColumnGap,
            display: "grid",
            padding: props.layoutPadding,
            width: "100%",
            maxWidth: "1280px",
        }
    }
    const smGridStyleCustom = () => {
        return {
            gridTemplateRows: props.smGridTemplateRows,
            gridTemplateColumns: props.smGridTemplateColumns,
            gridRowGap: props.smGridRowGap,
            gridColumnGap: props.smGridColumnGap,
            display: "grid",
            padding: props.layoutPadding,
            width: "100%",
        }
    }
    return (
        <div
            style={width < 768 ? smGridStyleCustom() : gridStyleCustom()}  
        >
            {children}
        </div>
    )
}

GridCustom.defaultProps = {
    // mdGridTemplateRows: "2fr",
    // mdGridTemplateColumns: "2fr",
    mdGridRowGap: "1fr",
    mdGridColumnGap: "1fr",
    // smGridTemplateRows: "2fr",
    smGridTemplateColumns: "1fr",
    smGridRowGap: "20px",
    smGridColumnGap: "20px",
    layoutPadding: "1rem"
}

GridCustom.propTypes = {
    mdGridTemplateRows: PropTypes.string,
}

export default GridCustom
