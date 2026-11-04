package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "DOCUMENT_SEQUENCE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentSequence {
  @Id
  @Column(name = "SEQUENCE_KEY", length = 30)
  private String sequenceKey;

  @Column(name = "LAST_VALUE", nullable = false)
  private Long lastValue;
}