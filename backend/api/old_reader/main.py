from extract_text import extract_text_from_document
from search_model import search_text
import config

def main():
    file_path = 'Honeywell reimbursement form.pdf'
    
    # Extract text using Document AI
    extracted_text = extract_text_from_document(file_path)
    print("Extracted Text:")
    print(extracted_text)

    # Continuous loop for reactive search using Vertex AI
    while True:
        query = input("Enter a query (or type 'exit' to quit): ")
        if query.lower() == 'exit':
            break
        
        results = search_text(query)
        print("Search Results:")
        for result in results:
            print(result)

if __name__ == "__main__":
    main()


# from extract_text import extract_text_from_document
# from sentence_transformers import SentenceTransformer, util

# def semantic_search_bert(text, query, threshold=0.75):
#     model = SentenceTransformer('all-MiniLM-L6-v2')
#     text_sentences = text.split('\n')
#     embeddings = model.encode(text_sentences, convert_to_tensor=True)
#     query_embedding = model.encode(query, convert_to_tensor=True)
    
#     hits = util.semantic_search(query_embedding, embeddings, top_k=len(text_sentences))
#     results = []
#     for hit in hits[0]:
#         if hit['score'] > threshold:
#             results.append((text_sentences[hit['corpus_id']], hit['score']))
    
#     return results

# def search_keywords(text, keywords):
#     results = {}
#     for keyword in keywords:
#         if keyword.lower() in text.lower():
#             results[keyword] = text.lower().count(keyword.lower())
#     return results

# # def semantic_search(text, query):
# #     nlp = spacy.load("en_core_web_lg")
# #     doc = nlp(text)
# #     query_doc = nlp(query)
# #     results = []
# #     for sent in doc.sents:
# #         if query_doc.similarity(nlp(sent.text)) > 0.75:  # Adjust the threshold as needed
# #             results.append(sent.text)
# #     return results

# def main():
#     file_path = 'Honeywell reimbursement form.pdf'
    
#     # Extract text using Document AI
#     extracted_text = extract_text_from_document(file_path)
#     print("Extracted Text:")
#     print(extracted_text)

#     # Prompt user for keywords
#     keywords_input = input("Enter keywords separated by commas: ")
#     keywords = [keyword.strip() for keyword in keywords_input.split(',')]
    
#     # Search for keywords in the extracted text
#     keyword_results = search_keywords(extracted_text, keywords)
#     print("Keyword Search Results:")
#     for keyword, count in keyword_results.items():
#         print(f"'{keyword}' found {count} times")

#     # Continuous loop for semantic search
#     while True:
#         query = input("Enter a semantic query (or type 'exit' to quit): ")
#         if query.lower() == 'exit':
#             break
        
#         # Perform semantic search in the extracted text
#         semantic_results = semantic_search_bert(extracted_text, query)
#         print("Semantic Search Results:")
#         for result, score in semantic_results:
#             print(f"Score: {score:.4f}, Text: {result}")
    
#     # Continuous loop for semantic search
#     # while True:
#     #     query = input("Enter a semantic query (or type 'exit' to quit): ")
#     #     if query.lower() == 'exit':
#     #         break
        
#     #     # Perform semantic search in the extracted text
#     #     semantic_results = semantic_search(extracted_text, query)
#     #     print("Semantic Search Results:")
#     #     for result in semantic_results:
#     #         print(result)

# if __name__ == "__main__":
#     main()
