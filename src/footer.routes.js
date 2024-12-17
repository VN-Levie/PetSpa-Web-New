// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";

//  components
import MKTypography from "components/MKTypography";

// Images
import logoCT from "assets/images/app-icon.png";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "PetSpa",
    image: logoCT,
    route: "/",
  },
  socials: [
    {
      icon: <FacebookIcon />,
      link: "#FB",
    },
    {
      icon: <TwitterIcon />,
      link: "#Twitter",
    },
    {
      icon: <GitHubIcon />,
      link: "#GitHub",
    },
    {
      icon: <YouTubeIcon />,
      link: "#YouTube",
    },
  ],
  menus: [
    {
      name: "company",
      items: [
        { name: "about us", href: "#About" },
      ],
    },
    {
      name: "resources",
      items: [
        
      ],
    },
    {
      name: "help & support",
      items: [
        { name: "contact us", href: "https://www.creative-tim.com/contact-us" },
      ],
    },
    {
      name: "legal",
      items: [
        { name: "terms & conditions", href: "#" },
        { name: "privacy policy", href: "#" },
        { name: "licenses (EULA)", href: "#" },
      ],
    },
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      All rights reserved. Copyright &copy; {date} PetSpa by{" "}
      <MKTypography
        component="b"
        href="#"
        target="_blank"
        rel="noreferrer"
        variant="button"
        fontWeight="regular"
      >
        T3.2412.E1 - G4
      </MKTypography>
      .
    </MKTypography>
  ),
};
