# PHP Base Syntax

## Instructions

PHP requires instructions to be terminated with a semicolon at the end of each statement. The closing tag of a block of PHP code automatically implies a semicolon.

### Basic PHP Example

```php
<?php echo "Hello World";  ?> 
```

## Case Sensitivity 

In PHP, all keywords (e.g. if, else, while, echo, etc.), classes, functions, and user-defined functions are NOT case-sensitive.

### Example

```php
<?php 
	echo "Hello World";  
	ECHO "Hello World"; 
?> 
```

All variable names are case-sensitive however.

```php
<?php 
	$hello = "Hello World";
	echo $hello;  // Right
	echo $HELLO; // Wrong
?> 
```

## Other Syntax

- [PHP Tags](php-tags)
- [Comments](comments.md)