/*
=========================================================
* 
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

//  components
import MKBox from "components/MKBox";
import MKBadge from "components/MKBadge";
import MKTypography from "components/MKTypography";

// Presentation page components
import ExampleCard from "pages/Presentation/components/ExampleCard";

// Add the necessary imports for API calls
import { useEffect, useState } from "react";
import { get } from "services/apiService";

function ServiceBlocks() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get('/api/public/spa/all-services');
        if (response.data.status === 200) {
          setData(response.data.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderData = data.map(({ name: title, description, items }) => (
    <Grid container spacing={3} sx={{ mb: 10 }} key={title}>
      <Grid item xs={12} lg={3}>
        <MKBox position="sticky" top="100px" pb={{ xs: 2, lg: 6 }}>
          <MKTypography variant="h3" fontWeight="bold" mb={1}>
            {title}
          </MKTypography>
          <MKTypography variant="body2" fontWeight="regular" color="secondary" mb={1} pr={2}>
            {description}
          </MKTypography>
        </MKBox>
      </Grid>
      <Grid item xs={12} lg={9}>
        <Grid container spacing={3}>
          {items.map(({ imageUrl: image, name, description, route }) => (
            <Grid item xs={12} md={4} sx={{ mb: 2 }} key={name}>
              <Link to={route}>
                <ExampleCard image={image} name={name} description={description} />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  ));

  return (
    <MKBox component="section" my={6} py={6}>
      <Container>
        <Grid
          container
          item
          xs={12}
          lg={6}
          flexDirection="column"
          alignItems="center"
          sx={{ textAlign: "center", my: 6, mx: "auto", px: 0.75 }}
        >
          <MKBadge
            variant="contained"
            color="info"
            badgeContent="Variety of services"
            container
            sx={{ mb: 2 }}
          />
          <MKTypography variant="h2" fontWeight="bold">
            Extensive Service Collection
          </MKTypography>
          <MKTypography variant="body1" color="text">
            We have designed multiple service packages for you to choose from and customize, providing the perfect spa experience for your pets.
          </MKTypography>
        </Grid>
      </Container>
      <Container sx={{ mt: 6 }}>{renderData}</Container>
    </MKBox>
  );
}

export default ServiceBlocks;
