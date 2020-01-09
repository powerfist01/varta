#include <bits/stdc++.h>
using namespace std;

struct Node{
    vector <pair<int,int> > end_of_word;
    Node* key[26];
    Node(){
        for(int i = 0;i<26;i++){
            key[i]=NULL;
        }
    }
};

int main(){
    int n;
    scanf("%d",&n);
    vector<string> genes(n);

    for(int i = 0; i < n; i++){
       cin>>genes[i];
    }

    vector<int> health(n);
    for(int i = 0; i < n; i++){
       cin>>health[i];
    }

    Node* root = new Node;
    for(int i = 0; i < n; i++){
        Node** temp = &root;
        int j = 0;
        while(j<genes[i].size()){
            temp = &((*temp)->key[genes[i][j]-'a']);
            if(*temp == NULL){
                *temp = new Node;
            }
            j++;
        }
        (*temp)->end_of_word.push_back(make_pair(i,health[i]));
    }
    
    int s;
    scanf("%d",&s);
    long long int minimum=LONG_LONG_MAX,maximum=0;
    while(s--){
    	int first,last;
    	long long int k=0;
        string d;
        scanf("%d%d",&first,&last);
        cin>>d;
        for(int j = 0;j<d.size();j++){
            Node* temp = root;
            int ptr = j;
            while(ptr<d.size()){
                temp = temp->key[d[ptr]-'a'];
                ptr++;
                if(temp == NULL){
                    break;
                }
                for(int i=0;i < temp->end_of_word.size(); i++){
                	pair<int,int>p = temp->end_of_word[i];
                    if(first <= p.first && p.first <= last){
                        k+=p.second;
                    }
                }
            }
        }
        minimum=min(minimum,k);
        maximum=max(maximum,k);
    }

    cout<<minimum<<" "<<maximum<<endl;
    return 0;
}