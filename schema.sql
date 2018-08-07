create database bamazon;
use bamazon;

create table products(
	itemid integer auto_increment not null,
    productname varchar(100) not null,
    departmentname varchar(100) not null,
    price decimal(10,2) not null,
    stockquantity integer(10) not null,
    primary key(itemid)
);