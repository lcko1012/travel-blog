import React, { useState, useRef, useEffect } from "react";

export default function withClickOutside(WrappedComponent) {
  const Component = (props) => {
    const [openNotify, setOpenNotify] = useState(false);

    const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (event) => {
        // console.log(event.target)
        if (!ref.current.contains(event.target)) {
          setOpenNotify(false);
        }
      };
      if(ref){
          document.addEventListener("mousedown", handleClickOutside);
      }
      else {
            document.removeEventListener("mousedown", handleClickOutside)
      }
      return () => document.removeEventListener("mousedown", handleClickOutside)
      
    }, [ref]);


    return <WrappedComponent openNotify={openNotify} setOpenNotify={setOpenNotify} ref={ref} />;
  };

  return Component;
}