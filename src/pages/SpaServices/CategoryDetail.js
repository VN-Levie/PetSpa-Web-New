import React from 'react';
import { useParams } from "react-router-dom";
function CategoryDetail(props) {
    const { catId, serviceId } = useParams();
    return (
        <div>
            <h1>Category ID: {catId}</h1>
            <h2>Service ID: {serviceId}</h2>
            <p>Displaying details for service {serviceId} in category {catId}.</p>
        </div>
    );
}

export default CategoryDetail;