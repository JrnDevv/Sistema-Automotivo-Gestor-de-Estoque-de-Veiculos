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

-- Inserindo veículos
INSERT INTO veiculos (modelo, ano, cor, preco, quilometragem, status, marca_id)
VALUES ('Corolla', 2021, 'Prata', 95000, 30000, 'Disponível', 1);

INSERT INTO veiculos (modelo, ano, cor, preco, quilometragem, status, marca_id)
VALUES ('Civic', 2020, 'Preto', 87000, 45000, 'Vendido', 2);

INSERT INTO veiculos (modelo, ano, cor, preco, quilometragem, status, marca_id)
VALUES ('Onix', 2022, 'Branco', 78000, 15000, 'Reservado', 3);


