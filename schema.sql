create database associacao

create table usuarios (
  	id serial primary key,
  	name text not null,
    email text not null unique,
    password text not null,
  );

  create table associados (
      id serial primary key,
      usuario_id integer not null,
      nome text not null,
      email text not null unique,
      telefone varchar(17) unique,
      status_associado text DEFAULT 'EM DIA' not null,
      posicao text,
      foreign key (usuario_id) references usuarios (id)
  );

 create table cobrancas (
	id serial primary key,
  	usuario_id integer not null,
  	associado_id integer not null,
  	data_vencimento date not null,
  	valor int not null,
  	status_cobranca text not null ,
    foreign key (usuario_id) references usuarios(id),
    foreign key (associado_id) references associados(id)
);







