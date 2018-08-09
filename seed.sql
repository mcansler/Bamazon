INSERT INTO products(ProductName,DepartmentName,Price,StockQuantity)

VALUES ("Canon 5D Mark IV", "Electronics", 3995.99, 15),
	("SanDisk Extreme Pro 64GB", "Electronics", 32.99, 100),
    ("The Last of Us Remastered", "Video Games", 21.95, 75),
    ("Destiny 2", "Video Games", 59.99, 150),
    ("Ready Player One", "Books", 8.99, 200),
    ("The Eye of the World", "Books", 9.99, 25),
    ("Deadpool 2", "Movies & TV", 22.96, 50),
    ("Black Panther", "Movies & TV", 22.96, 35),
	("Catan", "Toys & Games", 44.99, 4),
    ("Monopoly", "Toys & Games", 14.99, 10);
    
SELECT * FROM bamazon.products;

SELECT * FROM products WHERE stockquantity < 5;


