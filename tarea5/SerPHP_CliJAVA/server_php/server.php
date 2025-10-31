
<?php

ini_set("soap.wsdl_cache_enabled", "0"); 

class Operaciones {
    public function factores($params) {
        if (is_object($params)) {
            $params = get_object_vars($params);
        }

        if (is_array($params) && array_key_exists('lista', $params) && array_key_exists('numero', $params)) {
            $lista = $params['lista'];
            $numero = $params['numero'];
        } else {
            $args = func_get_args();
            if (count($args) == 2) {
                $lista = $args[0];
                $numero = $args[1];
            } else {
                throw new SoapFault("Server", "Parámetros inválidos");
            }
        }

        if (!is_array($lista)) {
            $lista = array($lista);
        }

        if (!is_numeric($numero)) {
            throw new SoapFault("Server", "Parámetro 'numero' inválido");
        }

        $factores = array();
        foreach ($lista as $n) {
            if (is_numeric($n) && $numero != 0 && $n % $numero == 0) {
                $factores[] = $n;
            }
        }
        $result = implode(", ", $factores);
        return array('result' => $result);
    }
}

$wsdl = __DIR__ . '/operaciones.wsdl';
$server = new SoapServer($wsdl);
$server->setClass('Operaciones');
$server->handle();
?>
