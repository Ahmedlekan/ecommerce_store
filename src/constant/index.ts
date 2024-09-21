import { facebook, instagram, shieldTick, support, truckFast, twitter } from "../assets/icons";
import { bigShoe1, bigShoe2, bigShoe3, customer1, customer2, shoe4, shoe5, shoe6, shoe7, 
    thumbnailShoe1, thumbnailShoe2, thumbnailShoe3, blog1, acc} from "../assets/images";
import { FormControl } from "../component/ui/RenderInputComponents";

export const shoes = [
    {
        thumbnail: thumbnailShoe1,
        bigShoe: bigShoe1,
    },
    {
        thumbnail: thumbnailShoe2,
        bigShoe: bigShoe2,
    },
    {
        thumbnail: thumbnailShoe3,
        bigShoe: bigShoe3,
    },
];

export const statistics = [
    { value: '1k+', label: 'Brands' },
    { value: '500+', label: 'Shops' },
    { value: '250k+', label: 'Customers' },
];

export const products = [
    {
        imgURL: shoe4,
        name: "Nike Air Jordan-01",
        price: "$200.20",
    },
    {
        imgURL: shoe5,
        name: "Nike Air Jordan-10",
        price: "$210.20",
    },
    {
        imgURL: shoe6,
        name: "Nike Air Jordan-100",
        price: "$220.20",
    },
    {
        imgURL: shoe7,
        name: "Nike Air Jordan-001",
        price: "$230.20",
    },
];

export const services = [
    {
        imgURL: truckFast,
        label: "Free Shipping",
        subtext: "From all orders over $100."
    },
    {
        imgURL: shieldTick,
        label: "Daile Surprice Offers",
        subtext: "Save up to 25% off."
    },
    {
        imgURL: support,
        label: "Love to help you",
        subtext: "Shop with an expert."
    },
    
    {
        imgURL: support,
        label: "Secure Payments",
        subtext: "100% protected payment"
    },
    
    {
        imgURL: support,
        label: "Affordable Prices",
        subtext: "Get factory direct price."
    },
];

export const reviews = [
    {
        imgURL: customer1,
        customerName: 'Morich Brown',
        rating: 4.5,
        feedback: "The attention to detail and the quality of the product exceeded my expectations. Highly recommended!"
    },
    {
        imgURL: customer2,
        customerName: 'Lota Mongeskar',
        rating: 4.5,
        feedback: "The product not only met but exceeded my expectations. I'll definitely be a returning customer!"
    },
    {
        imgURL: customer1,
        customerName: 'Morich Brown',
        rating: 4.5,
        feedback: "The attention to detail and the quality of the product exceeded my expectations. Highly recommended!"
    },
    {
        imgURL: customer2,
        customerName: 'Lota Mongeskar',
        rating: 4.5,
        feedback: "The product not only met but exceeded my expectations. I'll definitely be a returning customer!"
    },
];


export const footerLinks = [
    {
        title: "Products",
        links: [
            { name: "Air Force 1", link: "/" },
            { name: "Air Max 1", link: "/" },
            { name: "Air Jordan 1", link: "/" },
            { name: "Air Force 2", link: "/" },
            { name: "Nike Waffle Racer", link: "/" },
            { name: "Nike Cortez", link: "/" },
        ],
    },
    {
        title: "Help",
        links: [
            { name: "About us", link: "/" },
            { name: "FAQs", link: "/" },
            { name: "How it works", link: "/" },
            { name: "Privacy policy", link: "/" },
            { name: "Payment policy", link: "/" },
        ],
    },
    {
        title: "Get in touch",
        links: [
            { name: "customer@nike.com", link: "mailto:customer@nike.com" },
            { name: "+92554862354", link: "tel:+92554862354" },
        ],
    },
];

export const socialMedia = [
    { src: facebook, alt: "facebook logo" },
    { src: twitter, alt: "twitter logo" },
    { src: instagram, alt: "instagram logo" },
];

export const blogs = [
    {
      image: blog1,
      date: 'July 4, 2024',
      title: 'Product 1',
      description: 'This is a brief description of Product 1.',
    },
    {
      image: blog1,
      date: 'July 5, 2024',
      title: 'Product 2',
      description: 'This is a brief description of Product 2.',
    },
    {
      image: blog1,
      date: 'July 6, 2024',
      title: 'Product 3',
      description: 'This is a brief description of Product 3.',
    },
    {
      image: blog1,
      date: 'July 7, 2024',
      title: 'Product 4',
      description: 'This is a brief description of Product 4.',
    },
  ];

  export const collection = [
    {
      image: acc,
      name: 'Hawai',
      title: "Kids Headphone Bulk 10 Pack Multi Colored",
      price: 100,
    },
    {
      image: acc,
      name: 'Apple',
      title: "Kids Headphone Bulk 10 Pack Multi Colored",
      price: 120
    },
    {
      image: acc,
      name: 'Sony',
      title: "Kids Headphone Bulk 10 Pack Multi Colored",
      price: 150,
    },
    {
      image: acc,
      name: 'Nokia',
      title: "Kids Headphone Bulk 10 Pack Multi Colored",
      price: 200
    },
    {
      image: acc,
      name: 'Samsung',
      title: "Kids Headphone Bulk 10 Pack Multi Colored",
      price: 250
    },
    {
      image: acc,
      name: 'Tecno',
      title: "Kids Headphone Bulk 10 Pack Multi Colored",
      price: 300
    },
    
  ];

  export const category = {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  }

  export const brand = {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  }


  