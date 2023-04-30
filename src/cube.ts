import { BufferAttribute, BufferGeometry, Material, Mesh, PolyhedronGeometry } from "three";

export default class Cube {
  private material: Material;
  constructor(material: Material) {
    this.material = material;
    console.log('cube');
  }

  get methode1() {
    // methode 1 : on definie chaque face avec trois points à l'aide d'un buffer
    let buffer: BufferGeometry = new BufferGeometry();
    buffer.attributes.position = new BufferAttribute(new Float32Array(
      [
        -1, 1, -1,  // face arriere a (1)
        1, -1, -1,  // face arriere b (1)
        -1, -1, -1, // face arriere c (1) 
        1, 1, -1,   // face arriere a (2)
        1, -1, -1,  // face arriere b (2)
        -1, 1, -1,  // face arriere c (2)
        -1, -1, 1,  // face gauche  a (1)
        -1, 1, 1,   // face gauche  b (1)
        -1, 1, -1,  // face gauche  c (1)
        -1, 1, -1,  // face gauche  a (2)
        -1, -1, -1, // face gauche  b (2)
        -1, -1, 1,  // face gauche  c (2)
        1, -1, 1,   // face avant   a (1)
        1, 1, 1,    // face avant   b (1)
        -1, 1, 1,   // face avant   c (1)
        -1, 1, 1,   // face avant   a (2)
        -1, -1, 1,  // face avant   b (2)
        1, -1, 1,   // face avant   c (2)
        1, -1, -1,  // face droite a (1)
        1, 1, -1,   // face droite b (1)
        1, 1, 1,    // face droite c (1)
        1, 1, 1,    // face droite a (2)
        1, -1, 1,   // face droite b (2)
        1, -1, -1,  // face droite c (2)
        1, 1, 1,    // face dessus a (1)
        1, 1, -1,   // face dessus b (1)
        -1, 1, -1,  // face dessus c (1)
        -1, 1, -1,  // face dessus a (2)
        -1, 1, 1,   // face dessus b (2)
        1, 1, 1,    // face dessus c (2)
        1, -1, -1,  // face dessous a (1)
        1, -1, 1,   // face dessous b (1)
        -1, -1, 1,  // face dessous c (1)
        -1, -1, 1,  // face dessous a (2)
        -1, -1, -1, // face dessous b (2)
        1, -1, -1,  // face dessous c (2)
      ]), 3);

    return new Mesh(buffer, this.material);
  }

  get methode2() {
    // methode 2 : on definie tous les sommets de l'objet, puis on definie les faces à l'aide d'un tableau référencant les sommets
    let vertices =
      [
        -1, -1, 1,  // point 0
        1, -1, 1,   // point 1
        1, 1, 1,    // point 2
        -1, 1, 1,   // point 3
        -1, -1, -1, // point 4
        1, -1, -1,  // point 5
        1, 1, -1,   // point 6
        -1, 1, -1   // point 7
      ];

    let faces =
      [
        0, 1, 3, // face avant
        3, 1, 2, // face avant
        0, 3, 7, // face gauche
        7, 4, 0, // face gauche
        5, 6, 2,  // face droite
        2, 1, 5, // face droite
        4, 7, 6, // face derriere
        6, 5, 4, // face derriere
        2, 6, 7, // face dessus
        7, 3, 2, // face dessus
        5, 1, 0, // face dessous
        0, 4, 5 // face dessous
      ];

    let geom = new PolyhedronGeometry(vertices, faces, 1, 0);
    return new Mesh(geom, this.material);
  }
}
