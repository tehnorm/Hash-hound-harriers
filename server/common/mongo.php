<?php
/**
 * A MongoDB wrapper (initially grabbed from http://query7.com/mongodb-php-tutorial)
 */

class mongo
{
	public $connection;
	public $collection;

	public function __construct($host = $DB_SERVER)
	{
		$this->connection = new Mongo($host);
	}

	public function setDatabase($c)
	{
		$this->db = $this->connection->selectDB($c);
	}

	public function setCollection($c)
	{
		$this->collection = $this->db->selectCollection($c);
	}

	public function insert($f)
	{
		$this->collection->insert($f);
	}

	public function get($f)
	{
		$cursor = $this->collection->find($f);

		$k = array();
		$i = 0;

		while( $cursor->hasNext())
		{
		    $k[$i] = $cursor->getNext();
			$i++;
		}

		return $k;
	}

	public function update($f1, $f2)
	{
		$this->collection->update($f1, $f2);
	}

	public function getAll()
	{
		$cursor = $this->collection->find();
		foreach ($cursor as $id => $value)
		{
			echo "$id: ";
			var_dump( $value );
		}
	}

	public function delete($f, $one = FALSE)
	{
		$c = $this->collection->remove($f, $one);
		return $c;
	}

	public function ensureIndex($args)
	{
		return $this->collection->ensureIndex($args);
	}
}
?>