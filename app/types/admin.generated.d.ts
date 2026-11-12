/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.js';

export type VigorDescuentosQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type VigorDescuentosQuery = { discountNodes: { nodes: Array<(
      Pick<AdminTypes.DiscountNode, 'id'>
      & { metafield?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'jsonValue'>>, discount: (
        { __typename: 'DiscountAutomaticApp' }
        & Pick<AdminTypes.DiscountAutomaticApp, 'title' | 'status' | 'tags' | 'startsAt'>
      ) | { __typename: 'DiscountAutomaticBasic' | 'DiscountAutomaticBxgy' | 'DiscountAutomaticFreeShipping' | 'DiscountCodeApp' | 'DiscountCodeBasic' | 'DiscountCodeBxgy' | 'DiscountCodeFreeShipping' } }
    )> } };

export type VigorActualizarConfigMutationVariables = AdminTypes.Exact<{
  metafields: Array<AdminTypes.MetafieldsSetInput> | AdminTypes.MetafieldsSetInput;
}>;


export type VigorActualizarConfigMutation = { metafieldsSet?: AdminTypes.Maybe<{ userErrors: Array<Pick<AdminTypes.MetafieldsSetUserError, 'message'>> }> };

export type VigorCrearDescuentoMutationVariables = AdminTypes.Exact<{
  discount: AdminTypes.DiscountAutomaticAppInput;
}>;


export type VigorCrearDescuentoMutation = { discountAutomaticAppCreate?: AdminTypes.Maybe<{ automaticAppDiscount?: AdminTypes.Maybe<Pick<AdminTypes.DiscountAutomaticApp, 'discountId'>>, userErrors: Array<Pick<AdminTypes.DiscountUserError, 'field' | 'message'>> }> };

export type VigorCrearMetafieldDefMutationVariables = AdminTypes.Exact<{
  definition: AdminTypes.MetafieldDefinitionInput;
}>;


export type VigorCrearMetafieldDefMutation = { metafieldDefinitionCreate?: AdminTypes.Maybe<{ createdDefinition?: AdminTypes.Maybe<Pick<AdminTypes.MetafieldDefinition, 'id'>>, userErrors: Array<Pick<AdminTypes.MetafieldDefinitionCreateUserError, 'code' | 'message'>> }> };

export type VigorContextoQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type VigorContextoQuery = { locations: { nodes: Array<Pick<AdminTypes.Location, 'id' | 'name'>> }, publications: { nodes: Array<Pick<AdminTypes.Publication, 'id'>> } };

export type VigorColeccionQueryVariables = AdminTypes.Exact<{
  handle: AdminTypes.Scalars['String']['input'];
}>;


export type VigorColeccionQuery = { collectionByIdentifier?: AdminTypes.Maybe<Pick<AdminTypes.Collection, 'id'>> };

export type VigorCrearColeccionMutationVariables = AdminTypes.Exact<{
  collection: AdminTypes.CollectionCreateInput;
}>;


export type VigorCrearColeccionMutation = { collectionCreate?: AdminTypes.Maybe<{ collection?: AdminTypes.Maybe<Pick<AdminTypes.Collection, 'id'>>, userErrors: Array<Pick<AdminTypes.UserError, 'message'>> }> };

export type VigorProductSetMutationVariables = AdminTypes.Exact<{
  identifier?: AdminTypes.InputMaybe<AdminTypes.ProductSetIdentifiers>;
  input: AdminTypes.ProductSetInput;
}>;


export type VigorProductSetMutation = { productSet?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title'>
      & { variants: { nodes: Array<Pick<AdminTypes.ProductVariant, 'id' | 'sku' | 'displayName'>> } }
    )>, userErrors: Array<Pick<AdminTypes.ProductSetUserError, 'field' | 'message'>> }> };

export type VigorAddToColeccionMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  productIds: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type VigorAddToColeccionMutation = { collectionAddProducts?: AdminTypes.Maybe<{ userErrors: Array<Pick<AdminTypes.UserError, 'message'>> }> };

export type VigorPublicarMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  input: Array<AdminTypes.PublicationInput> | AdminTypes.PublicationInput;
}>;


export type VigorPublicarMutation = { publishablePublish?: AdminTypes.Maybe<{ userErrors: Array<Pick<AdminTypes.UserError, 'message'>> }> };

export type VigorStockBajoQueryVariables = AdminTypes.Exact<{
  query: AdminTypes.Scalars['String']['input'];
}>;


export type VigorStockBajoQuery = { productVariants: { nodes: Array<Pick<AdminTypes.ProductVariant, 'id' | 'sku' | 'displayName' | 'inventoryQuantity'>> } };

export type VigorVariantesQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type VigorVariantesQuery = { productVariants: { nodes: Array<Pick<AdminTypes.ProductVariant, 'id' | 'sku' | 'displayName'>> } };

interface GeneratedQueryTypes {
  "#graphql\n    query vigorDescuentos {\n      discountNodes(first: 50, query: \"method:automatic\") {\n        nodes {\n          id\n          metafield(namespace: \"$app\", key: \"config\") { jsonValue }\n          discount {\n            __typename\n            ... on DiscountAutomaticApp { title status tags startsAt }\n          }\n        }\n      }\n    }": {return: VigorDescuentosQuery, variables: VigorDescuentosQueryVariables},
  "#graphql\n    query vigorContexto {\n      locations(first: 1) { nodes { id name } }\n      publications(first: 20) { nodes { id } }\n    }": {return: VigorContextoQuery, variables: VigorContextoQueryVariables},
  "#graphql\n      query vigorColeccion($handle: String!) {\n        collectionByIdentifier(identifier: { handle: $handle }) { id }\n      }": {return: VigorColeccionQuery, variables: VigorColeccionQueryVariables},
  "#graphql\n    query vigorStockBajo($query: String!) {\n      productVariants(first: 100, query: $query, sortKey: INVENTORY_QUANTITY) {\n        nodes {\n          id\n          sku\n          displayName\n          inventoryQuantity\n        }\n      }\n    }": {return: VigorStockBajoQuery, variables: VigorStockBajoQueryVariables},
  "#graphql\n    query vigorVariantes {\n      productVariants(first: 250, sortKey: TITLE) {\n        nodes { id sku displayName }\n      }\n    }": {return: VigorVariantesQuery, variables: VigorVariantesQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n      mutation vigorActualizarConfig($metafields: [MetafieldsSetInput!]!) {\n        metafieldsSet(metafields: $metafields) { userErrors { message } }\n      }": {return: VigorActualizarConfigMutation, variables: VigorActualizarConfigMutationVariables},
  "#graphql\n    mutation vigorCrearDescuento($discount: DiscountAutomaticAppInput!) {\n      discountAutomaticAppCreate(automaticAppDiscount: $discount) {\n        automaticAppDiscount { discountId }\n        userErrors { field message }\n      }\n    }": {return: VigorCrearDescuentoMutation, variables: VigorCrearDescuentoMutationVariables},
  "#graphql\n      mutation vigorCrearMetafieldDef($definition: MetafieldDefinitionInput!) {\n        metafieldDefinitionCreate(definition: $definition) {\n          createdDefinition { id }\n          userErrors { code message }\n        }\n      }": {return: VigorCrearMetafieldDefMutation, variables: VigorCrearMetafieldDefMutationVariables},
  "#graphql\n        mutation vigorCrearColeccion($collection: CollectionCreateInput!) {\n          collectionCreate(collection: $collection) {\n            collection { id }\n            userErrors { message }\n          }\n        }": {return: VigorCrearColeccionMutation, variables: VigorCrearColeccionMutationVariables},
  "#graphql\n      mutation vigorProductSet($identifier: ProductSetIdentifiers, $input: ProductSetInput!) {\n        productSet(identifier: $identifier, input: $input, synchronous: true) {\n          product {\n            id\n            title\n            variants(first: 20) { nodes { id sku displayName } }\n          }\n          userErrors { field message }\n        }\n      }": {return: VigorProductSetMutation, variables: VigorProductSetMutationVariables},
  "#graphql\n        mutation vigorAddToColeccion($id: ID!, $productIds: [ID!]!) {\n          collectionAddProducts(id: $id, productIds: $productIds) {\n            userErrors { message }\n          }\n        }": {return: VigorAddToColeccionMutation, variables: VigorAddToColeccionMutationVariables},
  "#graphql\n    mutation vigorPublicar($id: ID!, $input: [PublicationInput!]!) {\n      publishablePublish(id: $id, input: $input) {\n        userErrors { message }\n      }\n    }": {return: VigorPublicarMutation, variables: VigorPublicarMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
