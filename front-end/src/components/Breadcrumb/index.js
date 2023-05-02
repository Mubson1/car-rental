import { Breadcrumb as BreadCrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Breadcrumb.scss";

export const Breadcrumb = ({ paths }) => (
  <BreadCrumb>
    {paths.map((item, idx) => (
      <BreadCrumb.Item
        className="breadcrumb_item"
        key={item.label}
        linkAs={Link}
        linkProps={{ to: item.redirect || "/#" }}
        active={idx + 1 === paths.length}>
        {item.label}
      </BreadCrumb.Item>
    ))}
  </BreadCrumb>
);
