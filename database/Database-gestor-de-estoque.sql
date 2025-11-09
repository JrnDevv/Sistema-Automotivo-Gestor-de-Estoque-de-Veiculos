create database db_gestao;

use  db_gestao;

create table veiculos(
id bigint not null auto_increment,
modelo varchar(40) not null,
marca_id bigint ,
ano int,
cor varchar(40),
preco double,
quilometragem int,
status varchar(40),
primary key (id),
foreign key(marca_id) references marcas(id)
);


create table marcas (
id bigint not null auto_increment,
nome varchar(59),
primary key(id)
);

-- Inserindo marcas
INSERT INTO marcas (nome) VALUES ('Toyota');
INSERT INTO marcas (nome) VALUES ('Honda');
INSERT INTO marcas (nome) VALUES ('Chevrolet');
INSERT INTO marcas (nome) VALUES ('Volkswagen');
INSERT INTO marcas (nome) VALUES ('Fiat');
INSERT INTO marcas (nome) VALUES ('Ford');
INSERT INTO marcas (nome) VALUES ('Hyundai');
INSERT INTO marcas (nome) VALUES ('Nissan');
INSERT INTO marcas (nome) VALUES ('Renault');
INSERT INTO marcas (nome) VALUES ('Peugeot');
INSERT INTO marcas (nome) VALUES ('Citroën');
INSERT INTO marcas (nome) VALUES ('Jeep');
INSERT INTO marcas (nome) VALUES ('BMW');
INSERT INTO marcas (nome) VALUES ('Mercedes-Benz');
INSERT INTO marcas (nome) VALUES ('Audi');
INSERT INTO marcas (nome) VALUES ('Volvo');
INSERT INTO marcas (nome) VALUES ('Land Rover');
INSERT INTO marcas (nome) VALUES ('Mitsubishi');
INSERT INTO marcas (nome) VALUES ('Kia');
INSERT INTO marcas (nome) VALUES ('Subaru');
INSERT INTO marcas (nome) VALUES ('Chery');
INSERT INTO marcas (nome) VALUES ('JAC Motors');
INSERT INTO marcas (nome) VALUES ('Ram');
INSERT INTO marcas (nome) VALUES ('Porsche');
INSERT INTO marcas (nome) VALUES ('Tesla');


-- Inserindo veículos
INSERT INTO veiculos (modelo, ano, cor, preco, quilometragem, status, marca_id)
VALUES ('Corolla', 2021, 'Prata', 95000, 30000, 'Disponível', 1);

INSERT INTO veiculos (modelo, ano, cor, preco, quilometragem, status, marca_id)
VALUES ('Civic', 2020, 'Preto', 87000, 45000, 'Vendido', 2);

INSERT INTO veiculos (modelo, ano, cor, preco, quilometragem, status, marca_id)
VALUES ('Onix', 2022, 'Branco', 78000, 15000, 'Reservado', 3);



-- Exemplo: associando o veículo id=6 à marca id=1 (Toyota)
UPDATE veiculos
SET marca_id = 1
WHERE id = 6;

-- id=7 → marca Mitsubishi
UPDATE veiculos
SET marca_id = 21
WHERE id = 7;

-- id=8 → marca Chevrolet
UPDATE veiculos
SET marca_id = 6
WHERE id = 8;


