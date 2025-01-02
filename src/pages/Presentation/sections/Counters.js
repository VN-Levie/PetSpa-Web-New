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

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

//  components
import MKBox from "components/MKBox";

//  examples
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

// Add the necessary imports for API calls
import { useEffect, useState } from "react";
import { get } from "services/apiService";

function Counters() {
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const categoryResponse = await get('/api/public/spa/count-categories');
        if (categoryResponse.data.status === 200) {
          setCategoryCount(categoryResponse.data.data);
        } else {
          console.error("Failed to fetch category count");
        }

        const productResponse = await get('/api/public/spa/count-products');
        if (productResponse.data.status === 200) {
          setProductCount(productResponse.data.data);
        } else {
          console.error("Failed to fetch product count");
        }

        const userResponse = await get('/api/public/spa/count-users');
        if (userResponse.data.status === 200) {
          setUserCount(userResponse.data.data);
        } else {
          console.error("Failed to fetch user count");
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <MKBox component="section" py={3}>
      <Container>
        <Grid container item xs={12} lg={9} sx={{ mx: "auto" }}>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              count={categoryCount}
              suffix="+"
              title="Types of Services"
              description="From bathing and grooming to health care, we are ready to pamper your pets."
            />
          </Grid>
          <Grid item xs={12} md={3} display="flex">
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />
            <DefaultCounterCard
              count={productCount}
              suffix="+"
              title="Service Packages"
              description="Combine services, customize them to your needs, and give your pets the ultimate spa experience."
            />
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={userCount}
              suffix="+"
              title="Loyal Customers"
              description="We have a large number of returning customers who trust the quality of our services."
            />
          </Grid>

        </Grid>
      </Container>
    </MKBox>

  );
}

export default Counters;
